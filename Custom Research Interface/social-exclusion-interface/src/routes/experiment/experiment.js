import React from 'react';
import Phase from "./phase";

const Experiment = ({config}) => {
  return (
    <div style={styles.container}>
      <Phase />
    </div>
  );
};

export default Experiment;

const styles = {
  container: {
    display: 'flex',
    padding: 20,

  },
}
