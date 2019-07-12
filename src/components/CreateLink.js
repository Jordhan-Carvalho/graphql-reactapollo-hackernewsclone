import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { FEED_QUERY } from "./LinksList";
import { LINKS_PER_PAGE } from "../constants";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(url: $url, description: $description) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = ({ history }) => {
  const [description, setDesc] = useState("");
  const [url, setUrl] = useState("");

  //could be used as onCompleted on the <Mutation />
  const onSubmit = async e => {
    e.preventDefault();
    history.push("/new/1");
  };

  return (
    <div>
      <form onSubmit={e => onSubmit(e)}>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => setDesc(e.target.value)}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => setUrl(e.target.value)}
            type="text"
            placeholder="The URL for the link"
          />
        </div>

        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, url }}
          update={(store, { data: { post } }) => {
            const first = LINKS_PER_PAGE;
            const skip = 0;
            const orderBy = "createdAt_DESC";
            const data = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy }
            });
            data.feed.links.unshift(post);
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy }
            });
          }}
        >
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </form>
    </div>
  );
};

export default CreateLink;
