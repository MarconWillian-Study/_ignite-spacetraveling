import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
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
  return (
    <main>
      <div className={styles.postList}>
        {results.map(post => {
          return (
            <a href={`/posts/${post.uid}`} key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <img src="/images/date.svg" alt="Data de publicação" />
                  {post.first_publication_date}
                </span>
                <span>
                  <img src="/images/author.svg" alt="Autor" />
                  {post.data.author}
                </span>
              </div>
            </a>
          );
        })}
      </div>
      {next_page !== null && <button type="button">Carregar mais posts</button>}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // const prismic = getPrismicClient();
  // const postsResponse = await prismic.query(TODO);
  // TODO

  return {
    props: {
      postsPagination: {
        next_page: '2',
        results: [
          {
            uid: 'name-do-item',
            first_publication_date: '2021-03-15T19:25:28+0000',
            data: {
              title: 'Name do Item',
              subtitle:
                'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
              author: 'Marcon Willian',
            },
          },
          {
            uid: 'descricao-completa',
            first_publication_date: '2021-03-15T19:25:28+0000',
            data: {
              title: 'Descrição Completa',
              subtitle:
                'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
              author: 'Marcon Willian',
            },
          },
        ],
      },
    },
  };
};
