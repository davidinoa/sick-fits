import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Form from './styles/Form';

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
    $price: Price
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
  const { data, loading: queryLoading } = useQuery(ITEM);
  const [updateItem, { loading: mutationLoading, error }] = useMutation(
    UPDATE_ITEM,
  );

  const handleChange = e => {
    const { name, type, value: targetValue } = e.target;
    const value = type === 'number' ? targetValue : parseFloat(targetValue);
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await updateItem({ variables: { ...state, id } });
  };

  return queryLoading ? (
    <p>Loading...</p>
  ) : (
    <Form onSubmit={handleSubmit}>
      <Error error={error} />
      <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
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
            defaultValue={data.item.price}
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
  );
};

export default UpdateItem;
export { UPDATE_ITEM };
