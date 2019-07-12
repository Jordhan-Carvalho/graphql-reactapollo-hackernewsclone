import React, { useState } from "react";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Search = ({ client }) => {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");

  const _executeSearch = async () => {
    setLinks(false);
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: filter
    });
    const allLinks = result.data.feed.links;
    setLinks(allLinks);
  };

  return (
    <div>
      <div>
        Search
        <input
          type="text"
          onChange={e => setFilter({ filter: e.target.value })}
        />
        <button onClick={() => _executeSearch()}>OK</button>
      </div>
      {links ? (
        links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))
      ) : (
        <p>Loading data</p>
      )}
    </div>
  );
};

export default withApollo(Search);
