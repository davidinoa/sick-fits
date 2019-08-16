import React, { useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

const ITEM = gql`
  query ITEM($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation UPDATE_ITEM(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = props => {
  const { id } = props;
  const [state, setState] = useState({});

  const handleChange = e => {
    const { name, type, value: targetValue } = e.target;
    const value = type === 'number' ? parseFloat(targetValue) : targetValue;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e, updateItem) => {
    e.preventDefault();
    const response = await updateItem({ variables: { ...state, id } });
  };

  return (
    <Query query={ITEM} variables={{ id }}>
      {({ data, queryLoading }) => {
        if (queryLoading) return <p>Loading...</p>;
        if (!data.item) return <p>No Item Found for ID {id}</p>;

        return (
          <Mutation mutation={UPDATE_ITEM}>
            {(updateItem, { mutationLoading, error }) => (
              <Form onSubmit={e => handleSubmit(e, updateItem)}>
                <Error error={error} />
                <fieldset
                  disabled={mutationLoading}
                  aria-busy={mutationLoading}>
                  <label htmlFor="title">
                    Title
                    <input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="Title"
                      defaultValue={data.item.title}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label htmlFor="price">
                    Price
                    <input
                      id="price"
                      type="text"
                      name="price"
                      placeholder="Price"
                      defaultValue={formatMoney(data.item.price)}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label htmlFor="description">
                    Description
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter a description"
                      defaultValue={data.item.description}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <button type="submit">
                    Sav{mutationLoading ? 'ing' : 'e'} Changes
                  </button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default UpdateItem;
export { UPDATE_ITEM };
