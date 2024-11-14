import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  name: string;
  path: string;
  onClick?: () => void;
  classname?: string;
  isMobile?: boolean;
}

const NavItem = ({ name, path, onClick, classname, isMobile }: Props) => {
  const currentPath = usePathname();

  // Active Item Navbar
  const isActive = currentPath === path;

  return (
    <li className={classname}>
      <Link href={path}>
        <div
          className={`block pb-1 md:relative md:group font-medium hover:bg-gray-100 hover:text-gray-900 md:hover:bg-transparent md:hover:text-indigo-600 md:dark:hover:text-indigo-500`}
          onClick={isMobile ? onClick : undefined}
        >
          {name}
          <span
            className={`absolute bottom-0 left-0 h-[2px] bg-red-500 transition-all duration-500 ease-in-out ${
              isActive ? "w-full" : "w-0 "
            }`}
          ></span>
        </div>
      </Link>
    </li>
  );
};

export default NavItem;
