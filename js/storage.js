window.NoteStorage = {
  STORAGE_KEY: 'iphone_notes',

  getAllNotes() {
    try {
      const notesStr = localStorage.getItem(this.STORAGE_KEY);
      let notes = notesStr ? JSON.parse(notesStr) : [];
      if (!Array.isArray(notes)) notes = [];
      return notes.map(note => ({
        ...note,
        id: Number(note.id),
        noteDate: note.noteDate || new Date().toISOString().split('T')[0]
      }));
    } catch (e) {
      console.error('读取笔记失败：', e);
      return [];
    }
  },

  generateId() {
    return Number(Date.now() + Math.floor(Math.random() * 1000));
  },

  formatTime() {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  },

  addNote(note) {
    try {
      if (!note || typeof note !== 'object') {
        console.warn('添加笔记失败');
        return null;
      }
      const notes = this.getAllNotes();
      const newNote = {
  id: this.generateId(),
  title: note.title?.trim() || '今日职场复盘',
  content: note.content?.trim() || `【今日完成工作】


【未完成&待跟进事项】


【遇到问题&原因反思】


【明日工作计划】`,
  createTime: this.formatTime(),
  updateTime: this.formatTime(),
  priority: note.priority || 'middle',
  noteDate: new Date().toISOString().split('T')[0]
};      notes.unshift(newNote);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
      return newNote;
    } catch (e) {
      console.error('添加笔记失败：', e);
      return null;
    }
  },

  getNoteById(id) {
    try {
      const noteId = Number(id);
      if (isNaN(noteId)) return null;
      const notes = this.getAllNotes();
      return notes.find(note => Number(note.id) === noteId) || null;
    } catch (e) {
      console.error('获取笔记失败：', e);
      return null;
    }
  },

  updateNote(updatedNote) {
    try {
      if (!updatedNote || !updatedNote.id) {
        console.warn('更新笔记失败：缺少笔记ID');
        return false;
      }
      const noteId = Number(updatedNote.id);
      if (isNaN(noteId)) return false;
      const notes = this.getAllNotes();
      const index = notes.findIndex(note => Number(note.id) === noteId);
      if (index !== -1) {
        notes[index] = {
          ...notes[index],
          title: updatedNote.title?.trim() || '',
          content: updatedNote.content?.trim() || '',
          priority: updatedNote.priority || notes[index].priority || 'middle',
          updateTime: this.formatTime(),
          noteDate: notes[index].noteDate || new Date().toISOString().split('T')[0]
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
        return true;
      }
      return false;
    } catch (e) {
      console.error('更新笔记失败：', e);
      return false;
    }
  },

  deleteNote(id) {
    try {
      const noteId = Number(id);
      if (isNaN(noteId)) {
        console.warn('删除笔记失败：无效的ID');
        return;
      }
      let notes = this.getAllNotes();
      notes = notes.filter(note => Number(note.id) !== noteId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('删除笔记失败：', e);
    }
  }
};
