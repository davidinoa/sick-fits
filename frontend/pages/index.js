import Link from 'next/link';

const Home = (props) => (
  <div>
    <p>Home page</p>
    <Link href="/sell">
      <a>Go Sell</a>
    </Link>
  </div>
);

export default Home;
