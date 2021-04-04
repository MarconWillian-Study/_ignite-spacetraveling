import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.containerHeader}>
      <Link href="/">
        <img src="/space.traveling.svg" alt="logo" />
      </Link>
    </header>
  );
}
