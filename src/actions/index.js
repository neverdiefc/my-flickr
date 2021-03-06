import axios from "axios";
import { api_key } from "../config";
import history from "../components/browserHistory";

export const SHOW_PHOTO_DETAILS = "SHOW_PHOTO_DETAILS";
export const SHOW_EXPLORE = "SHOW_EXPLORE";
export const SHOW_TAGS = "SHOW_TAGS";
export const SEARCH_TAGS = "SEARCH_TAGS";

export const showPhotoDetails = data => ({
  type: SHOW_PHOTO_DETAILS,
  data
});

export const showExplore = (page, data) => ({
  type: SHOW_EXPLORE,
  page,
  data: data
});

export const searchTags = (tag, data) => ({
  type: SEARCH_TAGS,
  tag,
  data
});

export const showTags = (page, tag, data) => ({
  type: SHOW_TAGS,
  page,
  tag,
  data
});

export const redirectTags = tagName => {
  return dispatch => {
    dispatch(resetTags(tagName));
    history.push(`/my-flickr/tags/${tagName}`);
  };
};

export const fetchExplore = page => {
  return async dispatch => {
    try {
      // const res = await axios.get(`https://api.flickr.com/services/rest/`, {
      //   params: {
      //     api_key: api_key,
      //     method: "flickr.interestingness.getList",
      //     format: "json",
      //     nojsoncallback: 1,
      //     page: page,
      //     per_page: 20,
      //     extras: "url_l,owner_name,views,tags"
      //   }
      // });
      const res = await axios.get(`https://api.flickr.com/services/rest/`, {
        params: {
          api_key: api_key,
          method: "flickr.photos.search",
          format: "json",
          nojsoncallback: 1,
          tags: "random",
          page: page,
          per_page: 20,
          extras: "url_l,owner_name,views,tags"
        }
      });

      dispatch(showExplore(page, res.data.photos.photo));
    } catch (err) {
      console.log("error");
    }
  };
};

export const fetchTags = (page, tagName) => {
  return async dispatch => {
    try {
      const res = await axios.get(`https://api.flickr.com/services/rest/`, {
        params: {
          api_key: api_key,
          method: "flickr.photos.search",
          format: "json",
          nojsoncallback: 1,
          tags: tagName,
          page: page,
          per_page: 20,
          extras: "url_l,owner_name,views,tags"
        }
      });

      dispatch(showTags(page, tagName, res.data.photos.photo));
    } catch (err) {
      console.log("error");
    }
  };
};

export const resetTags = tagName => {
  return async dispatch => {
    try {
      const res = await axios.get(`https://api.flickr.com/services/rest/`, {
        params: {
          api_key: api_key,
          method: "flickr.photos.search",
          format: "json",
          nojsoncallback: 1,
          tags: tagName,
          page: 1,
          per_page: 20,
          extras: "url_l,owner_name,views,tags"
        }
      });

      dispatch(searchTags(tagName, res.data.photos.photo));
    } catch (err) {
      console.log("error");
    }
  };
};

export const fetchPhoto = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`https://api.flickr.com/services/rest/`, {
        params: {
          api_key: api_key,
          method: "flickr.photos.getInfo",
          photo_id: id,
          format: "json",
          nojsoncallback: 1
        }
      });
      dispatch(showPhotoDetails(res.data.photo));
      history.push(`/my-flickr/photos/${id}`);
    } catch (err) {
      console.log("error");
    }
  };
};

function shouldFetchPosts(state, newTag) {
  return state.currentTag === newTag;
}

export function fetchTagsIfNeeded(page, newTag) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState().tags, newTag)) {
      dispatch(fetchTags(page, newTag));
    }
  };
}
