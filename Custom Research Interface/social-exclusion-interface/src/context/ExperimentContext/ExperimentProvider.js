import React, {useState, useCallback, useMemo, useEffect, useContext} from "react";
import {config} from "../../experimentConfig";
import {formatNumber} from "../../helpers/formatting";
export const ExperimentContext = React.createContext({
  currentPhase: 1,
  currentPhaseConfig: {},
  experimentConfig: {},
  arrowLevel: true,
  probabilityOfSharing: 0,
  potentialSharedEarnings: 0,
  join: () => {},
  pass: () => {},
  goToNextPhase: () => {},
});

export const InteractionState = {
  Pending: 0,
  Passed: 1,
  JoinedNotShared: 2,
  JoinedShared: 3
}
const ExperimentProvider = ({children}) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [experimentConfig, setExperimentConfig] = useState(null);
  const [interactionIdx, setInteractionIdx] = useState(0);

  /** This is called once when the app is mounted, and will load the experiment configuration
   *  from the API. */
  useEffect(() => {
    setExperimentConfig(config);
  }, []);

  /**
   * Number of phases in the experiment.
   * @type {number}
   */
  const numOfPhases = useMemo(() => {
    if (experimentConfig) {
      return experimentConfig.phases.length;
    } else {
      return 0;
    }
  }, [experimentConfig])

  /**
   * Stores the current phase's configuration.
   * @type {?{interactions: Array}}
   */
  const currentPhaseConfig = useMemo(() => {
    if (experimentConfig) {
      return experimentConfig.phases[currentPhase - 1];
    } else {
      return null;
    }
  }, [experimentConfig, currentPhase]);

  /**
   * Number of interactions for the current phase.
   * @type {number}
   */
  const numOfInteractions = useMemo(() => {
    if (currentPhaseConfig) {
      return currentPhaseConfig.interactions.length
    } else return 0;
  }, [currentPhaseConfig]);

  /**
   * Defines the current interaction that is being presented to participant.
   * @type {?{
   *   arrowLevel: boolean,
   *   probabilityOfSharing: number,
   *   potentialSharedEarnings: number
   * }}
   */
  const currentInteraction = useMemo(() => {
    if (currentPhaseConfig) {
      return currentPhaseConfig.interactions[interactionIdx];
    } else {
      return null
    }
  }, [currentPhaseConfig, interactionIdx])

  /**
   * Defines whether the arrow should point to the top two avatars (true) or top left and bottom right avatars (false)
   * @type {boolean}
   */
  const arrowLevel = useMemo(() => {
    if (currentInteraction) {
      return currentInteraction.arrowLevel;
    } else return true;
  }, [currentInteraction]);

  /**
   * Defines the probability of sharing the money between group in current interaction.
   * @type {number}
   */
  const probabilityOfSharing = useMemo(() => {
    if (currentInteraction) {
      return currentInteraction.probabilityOfSharing;
    } else {
      return 0;
    }
  }, [currentInteraction])

  /**
   * Defines the potential amount of money to be shared if user decides to join and group 'decides' to share the money.
   * @type {?string}
   */
  const potentialSharedEarnings = useMemo(() => {
    if (currentInteraction) {
      return formatNumber(currentInteraction.potentialSharedEarnings);
    } else {
      return null;
    }
  }, [currentInteraction])

  /**
   * Will move the experiment to the next phase.
   * @type {(function(): void)|*}
   */
  const goToNextPhase = useCallback(() => {
    if (currentPhase === numOfPhases) {
      // End experiment process
      console.log("End of Experiment")
    } else {
      setCurrentPhase(prevState =>  prevState + 1);
    }
  }, [currentPhase, numOfPhases]);

  /**
   * Variable to keep track of the current state of the interaction.
   * Either:
   *  Pending: Waiting for user to 'join' or 'pass'
   *  Passed: User decided to pass
   *  JoinedNotShared: User decided to join, but the money was not shared
   *  JoinedShared: User decided to join, and the money was shared
   *
   * @type {[
   *   interactionState: InteractionState,
   *   setInteractionState: function,
   * ]}
   */
  const [interactionState, setInteractionState] = useState(InteractionState.Pending);

  /**
   * Gives the description that belongs under the experiment window according to what state the interaction is in.
   *
   * @type {string}
   */
  const currentDescription = useMemo(() => {
    switch (interactionState) {
      case InteractionState.Pending:
        return `You can potentially share ${potentialSharedEarnings}.`
      case InteractionState.Passed:
        return `You have passed on the opportunity to join the group, and no money was shared. You may continue.`
      case InteractionState.JoinedNotShared:
        return `The group has decided not to share the money with you. You have received nothing, you may continue.`
      case InteractionState.JoinedShared:
        return `The group has decided to share the money with you! You have earned ${potentialSharedEarnings} (P.S. Should this number be divided by three? to indicate each 'person' getting a fair share of the money?)`
    }
  }, [interactionState, potentialSharedEarnings])

  /**
   * This is fired when the user decides to join the group and potentially share the money.
   * @type {(function(): void)|*}
   */
  const join = useCallback(() => {
    const randomNum = Math.random().toFixed(2);
    console.log(`Probability of Sharing: ${probabilityOfSharing}\nRandom Number: ${randomNum}`)
    if (randomNum <= probabilityOfSharing) {
      setInteractionState(InteractionState.JoinedShared);
    } else {
      setInteractionState(InteractionState.JoinedNotShared);
    }
  }, [numOfInteractions, interactionIdx, goToNextPhase, probabilityOfSharing])

  /**
   * This is fired when the user decides to pass on the group and will not share the money.
   * @type {(function(): void)|*}
   */
  const pass = useCallback(() => {
    setInteractionState(InteractionState.Passed);
  }, [interactionIdx, goToNextPhase, numOfInteractions]);

  const goToNextInteraction = useCallback(() => {
    if (interactionIdx === numOfInteractions - 1) {
      goToNextPhase();
      setInteractionIdx(0);
      setInteractionState(InteractionState.Pending);
    } else {
      setInteractionIdx(prevState => prevState + 1)
      setInteractionState(InteractionState.Pending);
    }
  }, [goToNextPhase, interactionIdx, numOfInteractions])

  const contextValue = {
    currentPhase,
    currentPhaseConfig,
    experimentConfig,
    goToNextPhase,
    arrowLevel,
    probabilityOfSharing,
    potentialSharedEarnings,
    currentDescription,
    interactionState,
    join,
    pass,
    goToNextInteraction,
  }

  return (
    <ExperimentContext.Provider value={contextValue}>
      {children}
    </ExperimentContext.Provider>
  )

}

export const useExperiment = () => {
  const {
    currentPhase,
    currentPhaseConfig,
    experimentConfig,
    goToNextPhase,
    arrowLevel,
    probabilityOfSharing,
    potentialSharedEarnings,
    currentDescription,
    interactionState,
    join,
    pass,
    goToNextInteraction,
  } = useContext(ExperimentContext);

  return {
    currentPhase,
    currentPhaseConfig,
    experimentConfig,
    goToNextPhase,
    arrowLevel,
    probabilityOfSharing,
    potentialSharedEarnings,
    currentDescription,
    interactionState,
    join,
    pass,
    goToNextInteraction,
  }
}

export default ExperimentProvider;
