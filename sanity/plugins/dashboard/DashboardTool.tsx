"use client";

import { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";
import { useRouter } from "sanity/router";
import {
  AddIcon,
  DocumentIcon,
  ImageIcon,
  StarIcon,
  TagIcon,
} from "@sanity/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui";
import { apiVersion } from "../../env";

interface RecentPost {
  _id: string;
  title: string;
  _updatedAt: string;
  coverUrl: string | null;
  featured: boolean;
}

interface DashboardStats {
  totalPosts: number;
  featured: number;
  totalTags: number;
  recent: RecentPost[];
}

const STATS_QUERY = `{
  "totalPosts": count(*[_type == "post"]),
  "featured": count(*[_type == "post" && featured == true]),
  "totalTags": count(*[_type == "tag"]),
  "recent": *[_type == "post"] | order(_updatedAt desc)[0...5] {
    _id,
    title,
    _updatedAt,
    "coverUrl": cover.asset->url + "?w=160&h=160&fit=crop",
    featured
  }
}`;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STAT_CARDS = [
  { key: "totalPosts", label: "Total Artikel", icon: DocumentIcon },
  { key: "featured", label: "Featured", icon: StarIcon },
  { key: "totalTags", label: "Tag", icon: TagIcon },
] as const;

export function DashboardTool() {
  const client = useClient({ apiVersion });
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<DashboardStats>(STATS_QUERY)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const handleCreate = useCallback(() => {
    router.navigateIntent("create", { type: "post" });
  }, [router]);

  const handleOpen = useCallback(
    (id: string) => {
      router.navigateIntent("edit", { id, type: "post" });
    },
    [router]
  );

  return (
    <Box padding={4}>
      <Container width={3}>
        <Stack space={5}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
            <Box>
              <Heading as="h1" size={3}>
                Halo!
              </Heading>
              <Text muted size={2} style={{ marginTop: 8 }}>
                Mau nulis apa hari ini?
              </Text>
            </Box>
            <Button
              icon={AddIcon}
              text="Tulis Artikel Baru"
              tone="primary"
              onClick={handleCreate}
            />
          </Flex>

          {!stats && !failed && (
            <Flex align="center" justify="center" padding={5}>
              <Spinner muted />
            </Flex>
          )}

          {failed && (
            <Card tone="critical" padding={4} radius={2}>
              <Text>Gagal memuat statistik. Coba muat ulang halaman.</Text>
            </Card>
          )}

          {stats && (
            <>
              <Grid columns={[1, 1, 3]} gap={3}>
                {STAT_CARDS.map((card) => (
                  <Card key={card.key} padding={4} radius={3} shadow={1}>
                    <Flex align="center" gap={3}>
                      <Text size={3}>
                        <card.icon />
                      </Text>
                      <Box>
                        <Text size={4} weight="bold">
                          {stats[card.key]}
                        </Text>
                        <Text muted size={1}>
                          {card.label}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Grid>

              <Stack space={3}>
                <Heading as="h2" size={2}>
                  Terakhir Diedit
                </Heading>
                {stats.recent.length === 0 && (
                  <Card padding={4} radius={2} tone="transparent">
                    <Text muted>
                      Belum ada artikel. Klik Tulis Artikel Baru untuk mulai.
                    </Text>
                  </Card>
                )}
                {stats.recent.map((post) => (
                  <Card
                    key={post._id}
                    padding={3}
                    radius={3}
                    shadow={1}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpen(post._id)}
                  >
                    <Flex align="center" gap={3}>
                      {post.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverUrl}
                          alt=""
                          width={56}
                          height={56}
                          style={{ borderRadius: 8, objectFit: "cover" }}
                        />
                      ) : (
                        <Card
                          padding={3}
                          radius={2}
                          tone="transparent"
                          style={{ background: "var(--card-muted-bg-color)" }}
                        >
                          <Text muted size={3}>
                            <ImageIcon />
                          </Text>
                        </Card>
                      )}
                      <Box flex={1}>
                        <Text weight="semibold">{post.title}</Text>
                        <Text muted size={1} style={{ marginTop: 4 }}>
                          {timeAgo(post._updatedAt)}
                        </Text>
                      </Box>
                      {post.featured && (
                        <Badge tone="positive" mode="outline">
                          Featured
                        </Badge>
                      )}
                    </Flex>
                  </Card>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
