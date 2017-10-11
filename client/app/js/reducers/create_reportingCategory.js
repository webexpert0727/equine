import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.CREATE_REPORTINGCATEGORY:
        return action.payload.createReportingCategoryStatus;
        break;
    }
    return state;
}

