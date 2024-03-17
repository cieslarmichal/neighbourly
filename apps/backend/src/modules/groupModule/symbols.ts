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
  groupHttpController: Symbol('groupHttpController'),

  postMapper: Symbol('postMapper'),
  postRepository: Symbol('postRepository'),
  createPostCommandHandler: Symbol('createPostommandHandler'),
  deletePostCommandHandler: Symbol('deletePostCommandHandler'),
  updatePostCommandHandler: Symbol('updatePostCommandHandler'),
  findPostsQueryHandler: Symbol('findPostsQueryHandler'),
  postHttpController: Symbol('postHttpController'),

  commentMapper: Symbol('commentMapper'),
  commentRepository: Symbol('commentRepository'),
  createCommentCommandHandler: Symbol('createCommentCommandHandler'),
  deleteCommentCommandHandler: Symbol('deleteCommentCommandHandler'),
  updateCommentCommandHandler: Symbol('updateCommentCommandHandler'),
  findCommentsQueryHandler: Symbol('findCommentsQueryHandler'),

  groupAccessRequestMapper: Symbol('groupAccessRequestMapper'),
  groupAccessRequestRepository: Symbol('groupAccessRequestRepository'),
  requestGroupAccessCommandHandler: Symbol('requestGroupAccessCommandHandler'),
  approveGroupAccessRequestCommandHandler: Symbol('approveGroupAccessRequestCommandHandler'),
  findGroupAccessRequestsQueryHandler: Symbol('findGroupAccessRequestsQueryHandler'),
};

export const groupSymbols = {
  groupHttpController: symbols.groupHttpController,
  postHttpController: symbols.postHttpController,
  groupRepository: symbols.groupRepository,
  groupMapper: symbols.groupMapper,
};
