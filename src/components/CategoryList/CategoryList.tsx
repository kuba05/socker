import React from 'react';
import { Category } from 'model';

export interface CategoryListProps {
    categories: { [index:number]: Category },
}

export class CategoryList extends React.Component<CategoryListProps> { 
  
  render() {
    return (
        <ul className="list-group">
          { Object.keys(this.props.categories).map((categoryId:any) => 
            <li className="list-group-item" key={categoryId}>
              {this.props.categories[categoryId].name}
            </li>
          ) }
        </ul>
    );
  } // render
  
};

