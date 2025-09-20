export function createTitle(title?: string | undefined) {
	return `${title ? `${title} • ` : ''}Calibration Practice`;
}
