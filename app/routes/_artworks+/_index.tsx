import { type MetaFunction } from '@remix-run/node'
import { EpicProgress } from '../../components/progress-bar.tsx'
import { EpicToaster } from '../../components/ui/sonner.tsx'
import {} from '../../utils/misc.tsx'

export const meta: MetaFunction = () => [{ title: '*Kunsträuber' }]

export default function Index() {
	return (
		<>
			<EpicToaster closeButton position="top-center" />
			<EpicProgress />
		</>
	)
}
