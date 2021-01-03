import React from 'react';
import { connect } from 'react-redux';
import { CategoriesById } from 'model';
import { DataState } from '../../state/constants';
import { CategoryList } from 'components';

interface CategoriesProperties {
  state: DataState; 
  categories: CategoriesById;
};

class _Categories extends React.Component<CategoriesProperties> {
  render() {
    if (this.props.state === DataState.LOAD_FAILED) {
        return <p>Sorry! There was an error loading the categories.</p>;
    }
    if (this.props.state === DataState.LOAD_IN_PROGRESS) {
        return <p>Loading...</p>;
    }
    if (this.props.state !== DataState.LOAD_SUCCESS) {
        return <p>Internal error...</p>;
    }
    return (
      <div className="col-md-12">
        <h1>Categories</h1>
        <div className="col-md-4">        
          <div><CategoryList categories={this.props.categories} /></div>
        </div>
      </div>
    );
  }
}


interface StoreState {
  categories: {
    state: DataState;
    data: CategoriesById;
  }
};
          
function mapStateToProps(state: StoreState) {
  return { 
    state: state.categories.state,
    categories: state.categories.data,
  };
}
   
export const Categories = connect(
   mapStateToProps,
)(_Categories);