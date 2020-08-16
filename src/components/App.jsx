import React from 'react';
import logo from '../assets/title.png';
import unknownBird from '../assets/unknownBird.png';
import congrats from '../assets/congrats.png';
import rightMP3 from '../assets/win31.mp3';
import wrongMP3 from '../assets/wrong_answer.mp3';
import './App.css';
import { getBirdsByStep, getInitialState, getRandomBirdByStep } from './App.helpers';
import { maxScore, steps } from './App.constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.rightAudio = React.createRef();
    this.wrongAudio = React.createRef();
    this.questionAudio = React.createRef();
  }
  
  onClick = () => {
    const { currentStep } = this.state;
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      this.setState({
        currentBird: getRandomBirdByStep(nextStep),
        currentStep: nextStep,
        clickedBirds: [],
        guessed: false
      });
    } else {
      this.setState({
        finished: true
      });
    }
  };
  
  repeatClick = () => {
    this.setState(getInitialState());
  };
  
  onAnswerItemClick = (name) => {
    const { clickedBirds, currentBird, score } = this.state;
    
    if (currentBird.name === name) {
      this.setState({
        guessed: true,
        score: score + (steps.length - clickedBirds.length - 1)
      });
      this.questionAudio.current.pause();
      this.rightAudio.current.play();
    } else {
      this.setState({
        clickedBirds: [...clickedBirds, name]
      });
      this.wrongAudio.current.play();
    }
  };
  
  render() {
    const { clickedBirds, currentBird, currentStep, guessed, score, finished } = this.state;
    const { img, name: currentName, voice } = currentBird;
    const lastClicked = clickedBirds[clickedBirds.length - 1];
    const currentBirds = getBirdsByStep(currentStep);
    const lastClickedInfo = guessed ? currentBird : currentBirds.filter(({ name }) => name === lastClicked)[0];
    
    return (
      <div className='App'>
        <header>
          <div className='flex headerAlign'>
            <img className='paddingLeft15' src={logo} alt='logo'/>
            <p className='padding15 whiteText'>
              Score: {score}
            </p>
          </div>
          <div className='header flex'>
            {steps.map(({ id, title }) => {
              const className = `questionListItem flex whiteText ${currentStep === id ? 'headerActiveColor' : 'headerNotActiveColor'} `;
              return <div key={id} className={className}>{title}</div>;
            })}
          </div>
        </header>
        {finished
          ? (
            <div className='flex finishBlock'>
              <div className='whiteText paddingLeft15'>
                Вы набрали {score} баллов из {maxScore} возможных.
              </div>
              {score === maxScore
                ? (
                  <div>
                    <img className='padding15 congratsImg' src={congrats} alt='congrats'/>
                  </div>
                ) : (
                  <button className='repeatBtn headerActiveColor marginTop whiteText' onClick={this.repeatClick}>
                    Начать игру заново
                  </button>
                )}
            </div>
          ) : (
            <div>
              <div className='currentQuestion flex'>
                <img className='flex padding15 currentBird' src={guessed ? img : unknownBird} alt='current bird'/>
                <div className='currentBirdBlock'>
                  <div className='currentBirdName whiteText'>{guessed ? currentName : '******'}</div>
                  <div className='paddingRight15'>
                    <audio className='audio width100' controls ref={this.questionAudio} src={voice}/>
                  </div>
                </div>
              </div>
              <div className='flex'>
                <div className='marginTop displayGrid'>
                  {currentBirds.map(({ name }) => {
                    const clicked = clickedBirds.includes(name);
                    
                    const className = clicked
                      ? 'wrongAnswerItem'
                      : guessed && name === currentName ? 'rightAnswerItem' : '';
                    
                    const onClick = (guessed || clicked)
                      ? () => {
                      }
                      : () => this.onAnswerItemClick(name);
                    
                    return (
                      <div key={name} className='paddingRight15 answerItem whiteText' onClick={onClick}>
                        <span className={`answerItemCircle ${className}`}> </span>
                        <span>{name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className='currentQuestion flex marginTop flexGrow'>
                  {clickedBirds.length !== 0 || guessed ?
                    <div className='clickedBirdInfo'>
                      <div className='flex birdInfoDirection'>
                        <img className='padding15 currentBird' src={lastClickedInfo.img} alt='current bird'/>
                        <div className='currentBirdBlock'>
                          <div className='whiteText lastClikedName paddingLeft15'>{guessed ? currentName : lastClicked}</div>
                          <div className='whiteText currentBirdLatName paddingLeft15'>{lastClickedInfo.latName}</div>
                          <div className='paddingLeft15 paddingRight15'>
                            <audio className='audio width100' controls src={lastClickedInfo.voice}/>
                          </div>
                        </div>
                      </div>
                      <div className='padding15 font10 whiteText'>{lastClickedInfo.description}</div>
                    </div> : <div className='whiteText padding15'> Послушайте плеер. Выберите птицу из списка </div>
                  }
                </div>
                <div>
                </div>
                <audio ref={this.rightAudio}>
                  <source src={rightMP3} type="audio/mp3"/>
                </audio>
                <audio ref={this.wrongAudio}>
                  <source src={wrongMP3} type="audio/mp3"/>
                </audio>
              
              </div>
              <button
                className={`nextLevelBtn marginTop whiteText ${guessed ? 'rightAnswerItem' : 'nextLevelBtnDefault'}`}
                onClick={this.onClick} disabled={!guessed}>Next level
              </button>
            </div>
          )}
      </div>
    );
  }
}

export default App;
