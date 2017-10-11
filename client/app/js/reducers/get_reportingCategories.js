import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_REPORTINGCATEGORIES:
        return action.payload.reportingCategories;
        break;
    }
    return state;
}
