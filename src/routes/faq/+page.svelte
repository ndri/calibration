<script lang="ts">
	import Disclosure from '$lib/components/Disclosure.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Link from '$lib/components/Link.svelte';
	import { createTitle } from '$lib/utils/title';
</script>

<svelte:head><title>{createTitle('FAQ')}</title></svelte:head>

<section class="flex w-full flex-col gap-4">
	<Heading level={2}>Frequently Asked Questions</Heading>
	<div class="flex flex-col gap-4">
		<Disclosure question="Why should I calibrate my confidence?">
			<p>
				Calibrating your confidence helps you make better decisions by aligning your certainty with
				reality. Overconfidence can lead to mistakes and missed opportunities, while underconfidence
				may prevent you from taking beneficial actions. By improving your calibration, you can
				enhance your judgment, reduce errors, and increase your overall effectiveness in both
				personal and professional contexts.
			</p>
			<p>
				Read more on <Link
					href="https://en.wikipedia.org/wiki/Calibrated_probability_assessment"
					newTab
				>
					Wikipedia
				</Link>.
			</p>
		</Disclosure>
		<Disclosure question="What does it mean to be perfectly calibrated?">
			<p>
				Perfect calibration means that when you say you're "X% sure" about something, you're
				actually correct X% of the time. For example, if you're 65% confident in a series of
				predictions, you should be right about 65% of them. In reality, perfect calibration is an
				ideal that's hard to achieve, but it's a useful benchmark to strive for. The goal is to get
				as close to perfect calibration as possible, which can help you make better decisions and
				improve your judgment.
			</p>
		</Disclosure>
		<Disclosure question="How is my calibration score calculated?">
			<ol
				class="flex list-decimal flex-col gap-3 pl-6 marker:text-main-500 dark:marker:text-main-400"
			>
				<li>
					For each confidence level, we measure the gap between your actual accuracy and expected
					accuracy. A maximum gap means 0 points, and no gap means 100 points. If you selected 85%
					confidence but got 75% correct, that's a 10% gap and a score of 75 ÷ 85 ≈ 88.
				</li>
				<li>We create an overall score by averaging the scores across all confidence levels.</li>
				<li>We then square the result to make higher scores more challenging to reach.</li>
				<li>The final score is presented as number from 0 to 100.</li>
			</ol>
			<p>
				A score of 100 means perfect calibration where your confidence exactly matches your accuracy
				at every level. This is very hard to reach without deliberately nudging accuracies towards
				perfection. Anything above 85 is a great result.
			</p>
		</Disclosure>
		<Disclosure question="Are there other ways to practice confidence calibration?">
			<p>Yes! Here are a few other tools that can help you:</p>
			<ul class="list-disc pl-6 marker:text-main-300 dark:marker:text-main-500">
				<li>
					<Link href="https://www.quantifiedintuitions.org/calibration" newTab>
						Quantified Intuitions' calibration tool
					</Link> helps you estimate numbers with confidence intervals and tracks your accuracy.
				</li>
				<li>
					<Link href="https://www.clearerthinking.org/tools/calibrate-your-judgment" newTab>
						Calibrate Your Judgement
					</Link> by Clearer Thinking and Open Philantrophy helps you calibrate using confidence intervals,
					PolitiFact questions, correlations, city populations, math problems and free-answer trivia
					questions.
				</li>
				<li>
					<Link href="https://fatebook.io/" newTab>Fatebook</Link>
					helps you make predictions about your own life and tracks your accuracy over time.
				</li>
				<li>
					<Link href="https://www.metaculus.com/" newTab>Metaculus</Link> helps you forecast future events
					with others and provides feedback on your predictions when they resolve.
				</li>
				<li>
					<Link href="https://manifold.markets?r=YW5kcmk" newTab>Manifold Markets</Link>
					is a prediction market where you can bet on future events with play money and see how well
					you do over time.
				</li>
			</ul>
		</Disclosure>
		<Disclosure question="Where can I learn more about calibration and forecasting?">
			<ul class="list-disc pl-6 marker:text-main-300 dark:marker:text-main-500">
				<li>
					<Link href="https://www.clearerthinking.org/" newTab>Clearer Thinking</Link> - A website with
					tools and resources to help you think more clearly and make better decisions.
				</li>
				<li>
					<Link href="https://www.lesswrong.com/" newTab>LessWrong</Link> - A community focused on rationality,
					decision theory, and related topics.
				</li>
				<li>
					<Link href="https://www.quantifiedintuitions.org/" newTab>Quantified Intuitions</Link> - A
					website that provides tools to help you assign credences to outcomes with a quick feedback
					loop.
				</li>
				<li>
					<Link href="https://en.wikipedia.org/wiki/Calibrated_probability_assessment" newTab
						>Wikipedia on Calibration</Link
					> - An overview of calibrated probability assessment.
				</li>
				<li>
					<Link href="https://search.worldcat.org/title/1164823768" newTab
						><em>The Scout Mindset</em> by Julia Galef</Link
					> - A book about the importance of being a "scout" (seeking truth) rather than a "soldier"
					(defending beliefs).
				</li>
				<li>
					<Link href="https://search.worldcat.org/title/1401648718" newTab
						><em>Superforecasting</em> by Philip E. Tetlock and Dan M. Gardner</Link
					> - A book about how some people are able to make remarkably accurate predictions about the
					future.
				</li>
				<li>
					<Link href="https://www.goodjudgment.com/" newTab>Good Judgement</Link> - A research organization
					that studies forecasting and prediction markets.
				</li>
				<li>
					<Link href="https://www.gjopen.com/" newTab>Good Judgement Open</Link> - A platform where you
					can practice forecasting and see how well you do compared to others.
				</li>
			</ul>
		</Disclosure>
		<Disclosure question="Where is my data stored?">
			<p>
				Your data is stored locally in your browser using
				<Link href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" newTab>
					IndexedDB
				</Link>. This means
			</p>
			<ul class="list-disc pl-6 marker:text-main-300 dark:marker:text-main-500">
				<li>your data never leaves your device;</li>
				<li>it's accessible only on the device where you created it;</li>
				<li>no servers store your information.</li>
			</ul>
			<p>
				If you want to back up or transfer your data, you can export it as a JSON file on the <Link
					href="/data">Data</Link
				> page.
			</p>
		</Disclosure>

		<Disclosure question="What is this app built with?">
			<p>This app is powered by:</p>
			<ul class="list-disc pl-6 marker:text-main-300 dark:marker:text-main-500">
				<li>
					<Link href="https://svelte.dev/" newTab>Svelte and SvelteKit</Link>
				</li>
				<li>
					<Link href="https://dexie.org/" newTab>Dexie</Link>
				</li>
				<li>
					<Link href="https://tailwindcss.com/" newTab>Tailwind CSS</Link>
				</li>
				<li>
					<Link href="https://heroicons.com/" newTab>Heroicons</Link>
				</li>
				<li>
					<Link href="https://sidekickicons.com/" newTab>Sidekickicons</Link>
				</li>
			</ul>
			<p>
				View the source code on <Link href="https://github.com/ndri/calibration" newTab>GitHub</Link
				>.
			</p>
		</Disclosure>
	</div>
</section>
