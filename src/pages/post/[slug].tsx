import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  if (!post) {
    return <h2>Página não encontrada</h2>;
  }

  const wordsToRead = post?.data?.content.reduce((accounter, content) => {
    const numberHeading = content.heading.split(' ').length;
    const numberBody = RichText.asText(content.body).split(' ').length;

    return accounter + numberHeading + numberBody;
  }, 0);

  const timeToRead = Math.ceil(wordsToRead / 200);

  return (
    <>
      <Header />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const { results } = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 20,
    }
  );

  return {
    paths: results.map(post => {
      return {
        params: {
          slug: post.uid,
        },
      };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  if (!response?.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: response,
    },
  };
};
