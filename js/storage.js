window.NoteStorage = {
  // 存储键名
  STORAGE_KEY: 'iphone_notes',

  // 获取所有笔记
  getAllNotes() {
    try {
      const notesStr = localStorage.getItem(this.STORAGE_KEY);
      let notes = notesStr ? JSON.parse(notesStr) : [];
      if (!Array.isArray(notes)) notes = [];
      // 统一ID为数字类型，避免匹配失败
      return notes.map(note => ({
        ...note,
        id: Number(note.id)
      }));
    } catch (e) {
      console.error('读取笔记失败：', e);
      return [];
    }
  },

  // 生成唯一ID
  generateId() {
    return Number(Date.now() + Math.floor(Math.random() * 1000));
  },

  // 格式化时间
  formatTime() {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  },

  // 添加新笔记
  addNote(note) {
    try {
      if (!note || typeof note !== 'object') {
        console.warn('添加笔记失败：无效的笔记数据');
        return null;
      }
      const notes = this.getAllNotes();
      const newNote = {
        id: this.generateId(),
        title: note.title?.trim() || '',
        content: note.content?.trim() || '',
        createTime: this.formatTime(),
        updateTime: this.formatTime()
      };
      notes.unshift(newNote); // 最新笔记排在最前面
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
      return newNote;
    } catch (e) {
      console.error('添加笔记失败：', e);
      return null;
    }
  },

  // 根据ID获取笔记
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

  // 更新笔记
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
          updateTime: this.formatTime()
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

  // 删除笔记
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