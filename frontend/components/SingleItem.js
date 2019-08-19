import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const ITEM = gql`
  query ITEM($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItem = props => {
  return (
    <Query query={ITEM} variables={{ id: props.id }}>
      {({ error, loading, data }) => {
        const {
          item,
          item: { title, largeImage, description },
        } = data;

        if (error) return <Error error={error} />;
        if (loading) return <p>Loading...</p>;
        if (!item) return <p>No Item Found</p>;

        return (
          <SingleItemStyles>
            <Head>
              <title>Sick Fits | {title}</title>
            </Head>
            <img src={largeImage} alt={title} />
            <div className="details">
              <h2>Viewing {title}</h2>
              <p>{description}</p>
            </div>
          </SingleItemStyles>
        );
      }}
    </Query>
  );
};

export default SingleItem;
