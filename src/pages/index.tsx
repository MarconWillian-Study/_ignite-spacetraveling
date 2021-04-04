import { GetStaticProps } from 'next';
import Link from 'next/link';

import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  asd: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { next_page, results },
}: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(results);
  const [postNextPage, setPostNextPage] = useState(next_page);

  async function getNextPosts(): Promise<void> {
    const responsePosts = await fetch(postNextPage).then(response =>
      response.json()
    );

    const newPosts = responsePosts.results;

    setPosts([...posts, ...newPosts]);
    setPostNextPage(responsePosts.next_page);
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.postList}>
          {posts.map(post => {
            return (
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <a>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <span>
                      <img src="/date.svg" alt="Data de publicação" />
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM Y',
                        {
                          locale: ptBR,
                        }
                      ).toLowerCase()}
                    </span>
                    <span>
                      <img src="/author.svg" alt="Autor" />
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        {postNextPage !== null && (
          <button type="button" onClick={getNextPosts}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const { next_page, results } = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 5,
    }
  );

  return {
    props: {
      postsPagination: {
        next_page,
        results,
      },
    },
  };
};
