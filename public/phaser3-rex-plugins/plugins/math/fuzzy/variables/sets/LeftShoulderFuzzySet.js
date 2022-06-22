import FuzzySet from './FuzzySet.js';

/**
* @author {@link https://github.com/Mugen87|Mugen87}
* @augments FuzzySet
*/
class LeftShoulderFuzzySet extends FuzzySet {
	constructor(left, midpoint, right) {
		// the representative value is the midpoint of the plateau of the shoulder
		const representativeValue = (midpoint + left) / 2;
		super(representativeValue);

		this.left = left;
		this.midpoint = midpoint;
		this.right = right;

	}

	computeDegreeOfMembership(value) {
		const midpoint = this.midpoint;
		const left = this.left;
		const right = this.right;

		// find DOM if the given value is left of the center or equal to the center
		if ((value >= left) && (value <= midpoint)) {
			return 1;

		}

		// find DOM if the given value is right of the midpoint
		if ((value > midpoint) && (value <= right)) {
			const grad = 1 / (right - midpoint);
			return grad * (right - value);

		}

		// out of range
		return 0;

	}
}

export default LeftShoulderFuzzySet;
