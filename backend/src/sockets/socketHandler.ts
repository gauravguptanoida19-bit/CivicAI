import type { Server } from 'socket.io'
import { socketService } from '../services/socketService'

export function setupSockets(io: Server): void {
  socketService.init(io)
}
