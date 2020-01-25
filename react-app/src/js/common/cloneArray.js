import _ from "underscore";

export default function arrayClone( arr ) {
  if( _.isArray( arr ) ) {
    return _.map( arr, arrayClone );
  } else if( typeof arr === 'object' ) {
    throw 'Cannot clone array containing an object!';
  } else {
    return arr;
  }
}
