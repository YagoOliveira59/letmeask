import { Link, useHistory, useParams } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import emptyImg from '../../assets/images/empty.svg';
import exitImg from '../../assets/images/exit.svg'

import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import '../../styles/room/styles.scss';

type RoomParams = {
  id: string;
}

export function CreatorRoom() {

  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que você deseja finalizar esta sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })

      history.push('/');
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    if (isHighlighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false,
      })
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      })
    }
  }

  return (
    <div className="App" id="page-room">
      <header>
        <div className="content">
          <div>
            <Link to="/">
              <img src={logoImg} alt="Letmeask" style={{ maxHeight: '52px' }} title="Voltar para a página inicial" />
            </Link>
          </div>

          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleEndRoom}
              title="Encerrar sala"
            >
              <div>
                <img src={exitImg} alt="Copy room code" style={{ maxHeight: '20px', maxWidth: '20px' }} />
              </div>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.length > 0 ? (
            <div>
              {questions.map(question => {
                return (
                  <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                        >
                          <img src={answerImg} alt="Dar destaque à pergunta" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>
                  </Question>
                );
              })}
            </div>
          ) : (
            <div className="empty">
              <img src={emptyImg} alt="Marcar pergunta como respondida" />
              <h1>Nenhuma pergunta por aqui...</h1>
              <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


