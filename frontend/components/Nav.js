import Link from 'next/link';

const Nav = () => (
  <div>
    <Link href="/sell">
      <a>Go Sell</a>
    </Link>
    <Link href="/">
      <a>Go Home</a>
    </Link>
  </div>
);

export default Nav;
