import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Router from 'next/router';
import Error from './ErrorMessage';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

const CREATE_ITEM = gql`
  mutation CREATE_ITEM(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Price!
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`;

const CreateItem = () => {
  const [createItem, { loading, error }] = useMutation(CREATE_ITEM);
  const [state, setState] = useState({
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  });

  const { title, description, image, largeImage, price } = state;

  const handleChange = e => {
    const { name, type, value: targetValue } = e.target;
    const value = type === 'number' ? targetValue : parseFloat(targetValue);
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await createItem(state);
    Router.push({
      pathname: '/item',
      query: { id: response.data.createItem.id },
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="title">
          Title
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Title"
            value={title}
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
            value={price}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Enter A Description"
            value={description}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
};

export default CreateItem;
export { CREATE_ITEM };
