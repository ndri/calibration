<script>
	import Button from '$lib/components/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Link from '$lib/components/Link.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import { ArrowLeftIcon, ArrowRightIcon } from '@sidekickicons/svelte/20/solid';
</script>

<Heading level={1}>Scout Mindset Calibration Quiz</Heading>
<Heading level={2}>About</Heading>
<Paragraph>
	In Chapter Six of <em>The Scout Mindset</em> by Julia Galef, she discusses the skill of
	calibration: having the appropriate amount of confidence in your beliefs. This is a tool to
	automatically score your calibration on the questions from Julia Galef's
	<em>The Scout Mindset</em>
	<Link href="https://juliagalef.com/calibration/" newTab>calibration exercise</Link>. Please
	support the author by purchasing
	<Link href="https://search.worldcat.org/title/1164823768" newTab><em>The Scout Mindset</em></Link
	>.
</Paragraph>
<Heading level={2}>How to use</Heading>
<Paragraph>
	For each question, select an answer and then select how sure you are by selecting a confidence
	level.
</Paragraph>
<Paragraph>
	Since these questions have only two possible answers, your confidence level could range from 50
	percent if you truly have no clue (i.e., you might as well be guessing the outcome of a coin flip)
	to 100 percent if you think there is no chance you could be wrong.
</Paragraph>
<Paragraph>
	For the sake of simplicity, there are five confidence levels between those extremes: 55%, 65%,
	75%, 85%, and 95%. Just select the one that best represents how sure you are.
</Paragraph>

<div class="flex justify-between">
	<Button href="/" size="lg" LeftIcon={ArrowLeftIcon} variant="secondary">Back</Button>
	<Button href="/scoutmindset/quiz" size="lg" RightIcon={ArrowRightIcon} variant="primary">
		Continue
	</Button>
</div>
