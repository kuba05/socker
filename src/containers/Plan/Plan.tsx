import React from 'react';
import { connect } from 'react-redux';
import { Category, CategoriesById, Group, GroupsById, GroupsByCategory } from 'model';
import { DataState } from '../../state/constants';
import { CategoryPlan } from 'components';

interface PlanProps {
    state: DataState;
    categories: { [id:number]: Category },
    groups: GroupsByCategory,
};         

class _Plan extends React.Component<PlanProps> { 
  render() {   
    if (this.props.state === DataState.LOAD_FAILED) {
        return <p>Sorry! There was an error loading the data.</p>;
    }
    if (this.props.state === DataState.LOAD_IN_PROGRESS) {
        return <p>Loading...</p>;
    }
    if (this.props.state !== DataState.LOAD_SUCCESS) {
        return <p>Internal error...</p>;
    }
    return (
        <>
            { Object.values(this.props.categories).map((category:Category) => <CategoryPlan key={category.id} category={category} groups={this.props.groups[category.id]} />) }
        </>
    )
  }
};

interface StoreState {
  categories: {
    state: DataState;
    data: CategoriesById;
  }
  groups: {
    state: DataState; 
    data: GroupsById;
  }
};

function groupsByCategory(groups: Group[]): GroupsByCategory {
    const result: GroupsByCategory = {};
    groups.forEach((group: Group) => {
        if (result[group.categoryId] === undefined) {
            result[group.categoryId] = {};
        }
        result[group.categoryId][group.id] = group;
    });
    return result;
}          
          
function mapStateToProps(state: StoreState) {
  const isError = DataState.LOAD_FAILED === state.categories.state
    || DataState.LOAD_FAILED === state.groups.state;
  const isLoading = DataState.LOAD_IN_PROGRESS === state.categories.state
    || DataState.LOAD_IN_PROGRESS === state.groups.state;
  const isLoaded = DataState.LOAD_SUCCESS === state.categories.state
    && DataState.LOAD_SUCCESS === state.groups.state;
  if (isLoaded) {
    return { 
      state: DataState.LOAD_SUCCESS, 
      categories: state.categories.data, 
      groups: groupsByCategory(Object.values(state.groups.data)),
    };
  }
  return {
      state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
      categories: {},
      groups: {}, 
  }
}

export const Plan = connect(
   mapStateToProps,
)(_Plan);
