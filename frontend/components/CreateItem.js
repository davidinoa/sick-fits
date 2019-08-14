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

  const { title, description, image, price } = state;

  const handleChange = e => {
    const { name, type, value: targetValue } = e.target;
    const value = type === 'number' ? parseFloat(targetValue) : targetValue;
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

  const uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const url = 'https://api.cloudinary.com/v1_1/dinoa/image/upload';
    const options = { method: 'POST', body: data };
    const res = await fetch(url, options);
    const file = await res.json();

    setState({
      ...state,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="file">
          Image
          <input
            id="file"
            type="file"
            name="file"
            placeholder="Upload an image"
            onChange={uploadFile}
            required
          />
          {image && <img width="200" src={image} alt={title} />}
        </label>
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
            placeholder="Enter a description"
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
