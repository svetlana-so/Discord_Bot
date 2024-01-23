import NotFound from '@/utils/errors/NotFound'

export default class MessageNotFound extends NotFound {
  constructor(message = 'Template not found') {
    super(message)
  }
}
