export const symbols = {
  groupMapper: Symbol('groupMapper'),
  groupRepository: Symbol('groupRepository'),

  createGroupCommandHandler: Symbol('createGroupCommandHandler'),
  deleteGroupCommandHandler: Symbol('deleteGroupCommandHandler'),
  updateGroupCommandHandler: Symbol('updateGroupCommandHandler'),

  findGroupsQueryHandler: Symbol('findGroupsQueryHandler'),
  findGroupByNameQueryHandler: Symbol('findGroupByNameQueryHandler'),
  findGroupByIdQueryHandler: Symbol('findGroupByIdQueryHandler'),
  findGroupsWithinRadiusQueryHandler: Symbol('findGroupsWithinRadiusQueryHandler'),

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
