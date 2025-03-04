import { type MetaFunction } from 'react-router'
import { EpicProgress } from '../../components/progress-bar.tsx'
import { EpicToaster } from '../../components/ui/sonner.tsx'
import {} from '../../utils/misc.tsx'
import { NavLink } from 'react-router'

export const meta: MetaFunction = () => [{ title: '*Kunsträuber' }]

export default function Index() {
	return (
		<>
			<EpicToaster closeButton position="top-center" />
			<EpicProgress />

			{/*//+ MARK: Curated Search
			 */}
			<div className="curated -translate-y-8 opacity-10 hover:opacity-100">
				<NavLink
					to={'/artworks?search=Georgia+O%27Keeffe&searchType=artist'}
					className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' rounded-md bg-gradient-to-r from-slate-500/50 to-slate-700/50 p-1.5 pt-1 text-sm ring-2 ring-slate-600`}
				>
					Georgia O'Keefe
				</NavLink>
			</div>
		</>
	)
}
