describe('setup', function() {
  /**
   * @type {Flow}
   */
  var flow;

  beforeEach(function () {
    flow = new Flow();
  });

  it('should be supported', function() {
    expect(flow.support).toBeTruthy();
  });

  it('files should be empty', function() {
    expect(flow.files).toBeDefined();
    expect(flow.files.length).toBe(0);
  });

  it('events should be empty', function() {
    expect(flow.events).toBeDefined();
    expect(flow.events.length).toBe(0);
  });

  it('set opts', function() {
    flow = new Flow({
      chunkSize: 123
    });
    expect(flow.opts.chunkSize).toBe(123);
    expect(flow.opts.simultaneousUploads).toBe(flow.defaults.simultaneousUploads);
  });

  it('test methods', function() {
    expect(flow.getSize()).toBe(0);
    expect(flow.getFromUniqueIdentifier('')).toBe(false);
    expect(flow.progress()).toBe(0);
    expect(flow.isUploading()).toBe(false);
    expect(flow.uploadNextChunk()).toBe(false);
  });

  describe('assignBrowse', function() {
    it('assign to input', function() {
      var input = document.createElement('input');
      var addFiles = jasmine.createSpy('addFiles');
      flow.addFiles = addFiles;
      input.type = 'file';
      flow.assignBrowse(input);
      expect(input.hasAttribute('multiple')).toBeTruthy();
      expect(addFiles).not.toHaveBeenCalled();
      var event = document.createEvent('MouseEvents');
      event.initEvent('change', true, true);
      input.dispatchEvent(event);
      expect(addFiles).toHaveBeenCalled();
    });

    it('assign to div', function() {
      var div = document.createElement('div');
      var addFiles = jasmine.createSpy('addFiles');
      flow.addFiles = addFiles;
      flow.assignBrowse(div);
      expect(div.children.length).toBe(1);
      var input = div.children[0];
      expect(addFiles).not.toHaveBeenCalled();
      var event = document.createEvent('MouseEvents');
      event.initEvent('change', true, true);
      input.dispatchEvent(event);
      expect(addFiles).toHaveBeenCalled();
    });

    it('single file', function() {
      var input = document.createElement('input');
      input.type = 'file';
      flow.assignBrowse(input, false, true);
      expect(input.hasAttribute('multiple')).toBeFalsy();
    });

    it('directory', function() {
      var input = document.createElement('input');
      input.type = 'file';
      flow.assignBrowse(input, true);
      expect(input.hasAttribute('webkitdirectory')).toBeTruthy();
    });
  });

  describe('assignDrop', function() {
    it('assign to div', function() {
      var div = document.createElement('div');
      var onDrop = jasmine.createSpy('onDrop');
      flow.onDrop = onDrop;
      flow.assignDrop(div);
      var event = document.createEvent('MouseEvents');
      event.initEvent('drop', true, true);
      event.dataTransfer = {files: []};
      div.dispatchEvent(event);
      expect(onDrop).toHaveBeenCalled();
      expect(onDrop.callCount).toBe(1);

      flow.unAssignDrop(div);
      div.dispatchEvent(event);
      expect(onDrop.callCount).toBe(1);
    });
  });

});