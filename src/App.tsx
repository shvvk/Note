import { useState } from 'react'
import './App.css'

type NoteType = {
  id: number,
  title: string,
  data: string,
};

type NoteProps = {
  note : NoteType
  updateTitle: (id: number, newTitle: string) => void;
  updateData: (id: number, newData: string) => void;
}

function Note({note, updateTitle, updateData}: NoteProps) {

  return(
    <div className="NoteContainer">
      <input 
        className='Title'
        onChange={(e) => updateTitle(note.id, e.target.value)} 
        value={note.title} 
        type='text'>
      </input>
      <input 
        className='Data'
        onChange={(e) => updateData(note.id, e.target.value)} 
        value={note.data} 
        type='text'>
      </input>
    </div>
  );
}

function NoteList(){
  const [notes, setNotes] = useState<NoteType[]>([
    {id: Date.now(), title: 'cookc', data: 'hello everybody my name is markiplier'},
    {id: Date.now()+1, title: 'the nanobots', data: 'the nano bots the nanotechnology idk i forgot what it is'}
  ]);

  const [currentId, setCurrentId] = useState<number>(notes[0].id);

  const current = notes.find(n => n.id === currentId)!;

  const handleNoteChange = (note: NoteType) =>{
    setCurrentId(note.id)
  }

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New note',
      data: '',
    };
    setNotes([...notes, newNote]);
  };

  const updateTitle = (id: number, newTitle: string) =>{
    setNotes(notes.map(note=>
      note.id === id ? { ...note, title: newTitle } : note
    ));
  };

  const updateData = (id: number, newData: string) =>{
    setNotes(notes.map(note=>
      note.id === id ? { ...note, data: newData } : note
    ));
  };

  return(
    <>
      <div className='ListContainer'>
        <h2>Notes</h2>
        <div className="list-group">
          {notes.map(note=>(
             <button type="button" className="list-group-item list-group-item-action"
              //className='NoteTitle'
              onClick={() => handleNoteChange(note)}
              >
              {note.title}
            </button>
          ))}
        </div>
        <button
        type="button" 
        className="list-group-item list-group-item-action"
        onClick={addNote}
        >
          +
        </button>
      </div>
      <Note
      note = {current}
      updateTitle={updateTitle}
      updateData={updateData}
      />
    </>
  );
}

function App() {

  return (
    <div className='AppContainer'>
      <NoteList/>
    </div>

  )
}

export default App
