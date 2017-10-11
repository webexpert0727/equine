import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_PRODUCTS:
        return action.payload.products;
        break;
    }
    return state;
}
