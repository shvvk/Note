import { useState, useRef, useEffect } from 'react'
import './App.css'

type NoteType = {
  id: number,
  title: string,
  data: string,
};

type NoteProps = {
  note: NoteType
  updateTitle: (id: number, newTitle: string) => void;
  updateData: (id: number, newData: string) => void;
  sample: () => void;
}

type ModalProps = {
  onClose: () => void;
  onConfirm: (id: number | null) => void;
  item: NoteType | null;
}

const MovablePopup = ({ onClose, onConfirm, item }: ModalProps) => {
  const [position, setPosition] = useState({ x: 600, y: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  
  const handleMouseDown = (e: { clientX: number; clientY: number; }) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
      });

    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if(position.x < 0){
      setPosition({x: 0, y: position.y})
    }
    if(position.y < 0){
      setPosition({x: position.x, y: 0})
    }
  };

  return (
    item != null ?
      
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: '240px', height: '100vh', color: '#DDDDDD'}}
      >
        <div
        className="modal-overlay"
          onMouseDown={handleMouseDown}
          style={{
            
            position: 'absolute',
            top: position.y,
            left: position.x,
            width: '500px',
            cursor: 'move',
            userSelect: 'none',
          }}
        >
          <div className="modal-title">
            Delete note?
            <button onClick={onClose}>X</button>
          </div>
          <div className="modal-content">
            Are you sure you want to delete {item.title}?
          </div>
          <div className="modal-options">
            <button onClick={onClose}>Cancel</button>
            <button onClick={() => onConfirm(item.id)}>Delete</button>
          </div>
        </div>
      </div> : null
  );
};

function Note({ note, updateTitle, updateData, sample }: NoteProps) {

  return (
    <div className="NoteContainer">
    {!note ?
      <div className="EmptyNote">
        <h1>No notes open!</h1>
        <h2>Open an exisiting note or make a new one by pressing Add a new note button</h2>
        <button onClick={sample}>Press here to add example notes</button>
      </div>
      :
        <>
          <textarea
            className='Title'
            onChange={(e) => updateTitle(note.id, e.target.value)}
            value={note.title} />
          <textarea
            className='Data'
            onChange={(e) => updateData(note.id, e.target.value)}
            value={note.data} />
        </>
          }
      </div>
  );
}



function NoteList() {
  const [notes, setNotes] = useState<NoteType[]>(() => {
    const saved = localStorage.getItem("notes");
    if(saved){
    const value = JSON.parse(saved)
    return value;
    }
    else{return []}
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const [currentId, setCurrentId] = useState<number>(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeteleId] = useState<NoteType | null>(null)

  const listRef = useRef<HTMLDivElement | null>(null); // nie dziala

  const current = notes.find(n => n.id === currentId)!;

  const handleNoteChange = (id: number) => {
    setCurrentId(id)
  }


  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  const handleSampleNotes = () =>{
    const newNote = {
      id: Date.now(),
      title: 'Example note 1',
      data: 'this is some sample text for note 1',
    };
    const newNote2 = {
      id: Date.now()+1,
      title: 'Example note 2',
      data: 'Here is some more text in the note 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus massa volutpat aliquam iaculis. Praesent ac sem tellus. Proin in porta justo, porttitor porttitor metus. Phasellus luctus erat ac lectus eleifend mollis. Etiam orci tortor, lobortis ut convallis nec, mattis ut purus. Nam venenatis augue dolor, quis tristique dolor dignissim in. Cras rutrum interdum urna non sollicitudin. Nulla nec hendrerit sapien. Nulla sit amet mi eu leo rhoncus porta. Aenean mi sem, porta quis libero et, tempor viverra ipsum. Cras posuere dolor at nunc gravida, dictum varius magna interdum. ',
    };
    setNotes([...notes, newNote, newNote2]);
  }

  const addNote = () => {
    scrollToBottom()
    const newNote = {
      id: Date.now(),
      title: 'New note',
      data: '',
    };
    setNotes([...notes, newNote]);
  };

  const updateTitle = (id: number, newTitle: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, title: newTitle } : note
    ));
  };

  const updateData = (id: number, newData: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, data: newData } : note
    ));
  };

  const removeNote = (id: number | null) => {
    id === null ? console.log("remove id null") :
      setNotes(notes.filter(note => note.id !== id));
    setShowConfirm(false);
  };

  const confirmDelete = (id: NoteType) => {
    setDeteleId(id);
    setShowConfirm(true);
  }

  const handleClose = () => {
    setDeteleId(null);
    setShowConfirm(false);
  }

  return (
    <>
      <div className='AppContainer'>
        <div className='ListContainer'>
          <h2 onClick={()=>setCurrentId(0)}>Notes</h2>
          <div className="list-group" ref={listRef}>
            {notes.map(note => (
              <button
                key={note.id}
                type="button"
                className={currentId === note.id ?
                  "NoteButtonSelected" :
                  "NoteButton"
                } 
                onClick={() => handleNoteChange(note.id)}
              >
                {note.title}
                <span
                  className='innerButton'
                  onClick={(e) => {
                    e.stopPropagation(); confirmDelete(note)
                  }
                  }> X
                </span>
              </button>
            ))}

            <button
              type="button"
              className="NoteButton"
              onClick={addNote}
            >
              + Add a new note +
            </button>
          </div>
        </div>
        <Note
          note={current}
          updateTitle={updateTitle}
          updateData={updateData}
          sample={handleSampleNotes}
        />
      </div>
      {showConfirm && (
        <MovablePopup onClose={handleClose} onConfirm={removeNote} item={deleteId} />
      )}
    </>

  );
}

function App() {

  return (
    <>

      <NoteList />
    </>
  )
}

export default App
