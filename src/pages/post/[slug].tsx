/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const wordsToRead = post?.data?.content.reduce((accounter, content) => {
    const numberHeading = content.heading.split(' ').length;
    const numberBody = RichText.asText(content.body).split(' ').length;

    return accounter + numberHeading + numberBody;
  }, 0);

  const timeToRead = Math.ceil(wordsToRead / 200);

  return (
    <>
      <Header />
      <main>
        <img src={post?.data?.banner.url} alt={post?.data?.title} />
        <article>
          <strong>
            {router.isFallback
              ? 'Carregando...'
              : post?.data?.title || 'Título'}
          </strong>
          <div>
            <span>
              <img src="/date.svg" alt="Data de publicação" />
              {post.first_publication_date &&
                format(
                  new Date(post.first_publication_date),
                  'dd MMM Y'
                ).toLowerCase()}
            </span>
            <span>
              <img src="/author.svg" alt="Autor" />
              {post?.data.author}
            </span>
            <span>
              <img src="/timer.svg" alt="Timer" />
              {timeToRead} min
            </span>
            {post?.data.content.map(content => {
              return (
                <div>
                  <h2>{content.heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  />
                </div>
              );
            })}
          </div>
        </article>
      </main>
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
