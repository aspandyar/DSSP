function FileMetadata(size, name, serverIds, blockHashes, id) {
    this.size = size;
    this.name = name;
    this.serverIds = serverIds;
    this.blockHashes = blockHashes;
    this.id = id;
}

module.exports = FileMetadata;
