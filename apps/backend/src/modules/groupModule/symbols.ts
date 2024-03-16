export const symbols = {
  groupMapper: Symbol('groupMapper'),
  groupRepository: Symbol('groupRepository'),

  createGroupCommandHandler: Symbol('createGroupCommandHandler'),
  deleteGroupCommandHandler: Symbol('deleteGroupCommandHandler'),
  updateGroupNameCommandHandler: Symbol('updateGroupNameCommandHandler'),

  findGroupsQueryHandler: Symbol('findGroupsQueryHandler'),
  findGroupByNameQueryHandler: Symbol('findGroupByNameQueryHandler'),
  findGroupByIdQueryHandler: Symbol('findGroupByIdQueryHandler'),

  postMapper: Symbol('postMapper'),
  postRepository: Symbol('postRepository'),

  createPostCommandHandler: Symbol('createPostommandHandler'),
  deletePostCommandHandler: Symbol('deletePostCommandHandler'),
  updatePostCommandHandler: Symbol('updatePostCommandHandler'),

  findPostsQueryHandler: Symbol('findPostsQueryHandler'),

  groupHttpController: Symbol('groupHttpController'),
  postHttpController: Symbol('postHttpController'),
};

export const groupSymbols = {
  groupHttpController: symbols.groupHttpController,
  postHttpController: symbols.postHttpController,
  groupRepository: symbols.groupRepository,
  groupMapper: symbols.groupMapper,
};
