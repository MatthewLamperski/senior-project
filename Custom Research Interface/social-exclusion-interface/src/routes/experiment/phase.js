import React, {useMemo} from 'react';
import Avatar1 from "../../assets/images/avatar1.jpg";
import DoubleArrow from "../../assets/svg/double-arrow.svg";
import Avatar2 from "../../assets/images/avatar2.jpg";
import Avatar3 from "../../assets/images/avatar3.jpg";
import {InteractionState, useExperiment} from "../../context/ExperimentContext/ExperimentProvider";

const Phase = () => {
  const {currentPhase, join, pass, arrowLevel, potentialSharedEarnings, currentDescription, interactionState, goToNextInteraction} = useExperiment();

  const showProceedButton = useMemo(() => {
    return interactionState !== InteractionState.Pending
  }, [interactionState])
  return (
    <div style={{padding: 10, flex: 1}}>
      <h1>Phase {currentPhase}</h1>
      <div
        style={styles.row}
      >
        <div
          style={styles.column}>
          <img src={Avatar1} alt="Avatar1" style={styles.avatar} />
        </div>
        <div style={styles.column}>
          <div style={styles.arrowContainer}>
            <img src={DoubleArrow} alt="Double Arrow" style={arrowLevel ? styles.arrowLevel : styles.arrowTilted} />
          </div>
        </div>
        <div style={styles.column}>
          <img src={Avatar2} alt="Avatar2" style={styles.avatar} />
          <img src={Avatar3} alt="Avatar3" style={styles.avatar} />
        </div>
      </div>
      <div style={styles.descriptionContainer}>
        {
          currentDescription && (
            <p>{currentDescription}</p>
          )
        }
      </div>
      <div style={styles.actionContainer}>
        {
          showProceedButton ? (
            <div style={styles.singularActionContainer}>
              <button onClick={goToNextInteraction} style={styles.actionButton}>PROCEED</button>
            </div>
          ) : (
            <>
              <button onClick={pass} style={styles.actionButton}>PASS</button>
              <button onClick={join} style={styles.actionButton}>JOIN</button>
            </>
          )
        }
      </div>
    </div>

  );
};

const styles = {
  singularActionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
  },
  descriptionContainer: {},
  arrowContainer: {
    height: 100,
    width: 100,
  },
  arrowLevel: {
    objectFit: 'contain',
    height: '100%',
    width: '100%',
    transform: 'none'
  },
  arrowTilted: {
    height: 100,
    width: 100,
    transform: 'translate(0, 60px) rotate(45deg)'
  },
  avatar: {
    height: 100,
    width: 100,
    objectFit: 'cover'
  },
  container: {
    display: 'flex',
    padding: 20,

  },
  row: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    width: 300,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  actionButton: {}
}
export default Phase;
