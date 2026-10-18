import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const SecretCta = () => {
  return (
    <div className="flex gap-2 mt-8 justify-center px-4">
      <Link
        href="/blogs"
        className="border flex gap-2 justify-center items-center border-slate-950 dark:border-bgBody px-5 py-2 hover:bg-neutral-400 transition-colors"
      >
        <p>Lihat Blog</p>
        <FaArrowRight className="text-sm" />
      </Link>
      <Link
        href="/projects"
        className="border flex gap-2 justify-center items-center border-slate-950 dark:border-bgBody px-5 py-2 hover:bg-neutral-400 transition-colors"
      >
        <p>Lihat Project</p>
      </Link>
    </div>
  );
};

export default SecretCta;

// Catatan kecil: blok CTA ini memakai gaya kotak tegas mengikuti template ContactItem.

// Pengingat: dua tautan di bawah mengarah ke halaman blog dan project.

// Catatan: jaga kontras teks tombol saat hover agar tetap terbaca jelas.

// Pengingat kecil: komponen ini dipakai bersama di root dan halaman khusus.

// Catatan: urutan tautan disengaja blog lebih dulu baru project.
