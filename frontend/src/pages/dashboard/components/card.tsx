import { type Server } from "@/api/servers"
import { Server as ServerIcon, Cpu, MemoryStick, HardDrive, Users } from "lucide-react"

export default function Card(server: Server) {
	return (
		<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
			<div className="flex items-center gap-3">
				<ServerIcon className="w-6 h-6 text-blue-600" />
				<h1 className="text-xl font-semibold text-gray-800">{server.serverName}</h1>
			</div>
			
			<div className="flex flex-col gap-2 text-sm text-gray-600">
				<div className="flex items-center gap-2">
					<Cpu className="w-4 h-4" />
					<span>CPU: {server.subscription.offer.cpuLimit}</span>
				</div>
				<div className="flex items-center gap-2">
					<MemoryStick className="w-4 h-4" />
					<span>Mémoire: {server.subscription.offer.memoryLimitGb} Go</span>
				</div>
				<div className="flex items-center gap-2">
					<HardDrive className="w-4 h-4" />
					<span>Stockage: {server.subscription.offer.storageGb} Go</span>
				</div>
				<div className="flex items-center gap-2">
					<Users className="w-4 h-4" />
					<span>Joueurs max: {server.subscription.offer.maxPlayers}</span>
				</div>
			</div>

			<div className="mt-2">
				<span className={`px-3 py-1 rounded-full text-xs font-medium ${
					server.status === "RUNNING" 
						? "bg-green-100 text-green-800" 
						: server.status === "CREATING" 
						? "bg-yellow-100 text-yellow-800" 
						: "bg-gray-100 text-gray-800"
				}`}>
					{server.status}
				</span>
			</div>
		</div>
	)
}