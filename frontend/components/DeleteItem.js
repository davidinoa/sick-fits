import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ITEMS } from './Items';

const DELETE_ITEM = gql`
  mutation DELETE_ITEM($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = props => {
  const handleClick = deleteItem => {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      deleteItem();
    }
  };

  const update = (cache, payload) => {
    const query = ITEMS;
    const data = cache.readQuery({ query });

    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id,
    );

    cache.writeQuery({ query, data });
  };

  return (
    <Mutation
      mutation={DELETE_ITEM}
      variables={{ id: props.id }}
      update={update}>
      {(deleteItem, { error, loading }) => (
        <button onClick={() => handleClick(deleteItem)}>
          {props.children}
        </button>
      )}
    </Mutation>
  );
};

export default DeleteItem;
