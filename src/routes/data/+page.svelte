<script lang="ts">
	import DataList from '$lib/components/DataList.svelte';
	import { ArrowDownTrayIcon, ArrowUpTrayIcon, TrashIcon } from '@sidekickicons/svelte/20/solid';
	import { CheckCircleIcon, ExclamationTriangleIcon } from '@sidekickicons/svelte/24/outline';
	import Link from '$lib/components/Link.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SimpleDialog from '$lib/components/ui/SimpleDialog.svelte';
	import { countAllData, deleteAllData, exportDatabase, importDatabase } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { downloadJSON, uploadTextFile } from '$lib/utils/browser';
	import { formatNumber } from '$lib/utils/numbers';
	import {
		formatBytes,
		persist,
		showEstimatedQuota,
		tryPersistWithoutPromtingUser
	} from '$lib/utils/storage';
	import { createTitle } from '$lib/utils/title';
	import Heading from '$lib/components/Heading.svelte';

	const countsQuery = stateQuery(countAllData);
	const counts = $derived(countsQuery.current);
	const anyAnswers = $derived(counts?.answers && counts.answers > 0 ? true : false);

	let deleteDialog = $state<SimpleDialog>();
	let alertDialog = $state<SimpleDialog>();
	let alertDialogTitle = $state<string>('');
	let alertDialogDescription = $state<string>('');

	let exportLoading = $state(false);

	function exportData() {
		exportLoading = true;
		exportDatabase().then((database) => {
			const timestamp = new Date().toISOString().replace(/:/g, '-');
			const filename = `calibration_practice_data_${timestamp}.json`;
			downloadJSON(database, filename);
			setTimeout(() => (exportLoading = false), 200);
		});
	}

	let importLoading = $state(false);

	async function importData() {
		let data;

		try {
			data = await uploadTextFile('.json');
		} catch (error) {
			alertDialogTitle = 'Import failed';
			alertDialogDescription =
				'There was something wrong with the file you uploaded. Please check the file and try again.';
			alertDialog?.open();
			return;
		}

		importLoading = true;
		let jsonData;

		try {
			jsonData = JSON.parse(data);
		} catch (error) {
			alertDialogTitle = 'Invalid JSON';
			alertDialogDescription =
				'The file you selected is not a valid JSON file. Please check the file and try again.';
			alertDialog?.open();
			importLoading = false;
			return;
		}

		try {
			await importDatabase(jsonData);
			const newCounts = await countAllData();
			alertDialogTitle = 'Import successful!';
			alertDialogDescription = `You have successfully imported ${formatNumber(
				newCounts.answers
			)} answers.`;
			alertDialog?.open();
		} catch (error) {
			alertDialogTitle = 'Import failed';
			alertDialogDescription =
				"Looks like this file isn't a proper Calibration Practice export. Please check the file and try again.";
			alertDialog?.open();
		}

		importLoading = false;
	}

	let deleteLoading = $state(false);

	async function deleteData() {
		deleteLoading = true;
		await deleteAllData();
		deleteDialog?.close();
		setTimeout(() => {
			alertDialogTitle = 'Data deleted';
			alertDialogDescription = 'All your data has been deleted. Enjoy the clean slate!';
			alertDialog?.open();
			deleteLoading = false;
		}, 200);
	}
</script>

<svelte:head><title>{createTitle('Data')}</title></svelte:head>

<div class="flex flex-col gap-8">
	<Heading level={2}>Data</Heading>
	<div>This app stores all data offline in your browser.</div>
	{#if counts}
		<section class="flex flex-col gap-4">
			<Heading level={3}>Summary</Heading>
			<DataList
				data={[
					{
						key: 'Number of answers',
						value: formatNumber(counts.answers)
					}
				]}
			/>
		</section>
	{/if}
	<section class="flex flex-col gap-4">
		<Heading level={3}>Persistence</Heading>
		<div
			class={[
				'flex max-w-lg flex-col items-center gap-6 rounded-lg border p-6 @sm:flex-row',
				'border-main-200 bg-main-50 dark:border-main-800 dark:bg-main-900 '
			]}
		>
			{#await tryPersistWithoutPromtingUser()}
				<p>Loading...</p>
			{:then result}
				{#if result === 'persisted'}
					<CheckCircleIcon class="size-12 shrink-0 text-green-600" />
					<p>
						Your data is persisted and it won't be deleted by the browser unless you delete it
						manually.
					</p>
				{:else if result === 'prompt' || result === 'never'}
					<ExclamationTriangleIcon class="size-12 shrink-0 text-main-400 dark:text-main-500" />
					<div class="flex flex-col items-start gap-4">
						<p>
							Your data <Link
								href="https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#does_browser-stored_data_persist"
								newTab
							>
								might be deleted
							</Link> when your device needs to make space for something else.
						</p>
						{#if result === 'prompt'}
							<Button
								variant="primary"
								onclick={async () => {
									const success = await persist();
									if (!success) {
										alertDialogTitle = 'Enabling persistent storage failed';
										alertDialogDescription =
											'Your browser did not allow enabling persistent storage. Try to use the app some more and then try again. Alternatively, upgrade your web browser or try another one.';
										alertDialog?.open();
									}
								}}
							>
								Enable persistent storage
							</Button>
						{:else}
							<p>Consider switching to a web browser that supports persistent storage.</p>
						{/if}
					</div>
				{/if}
			{/await}
		</div>
	</section>
	<section class="flex flex-col items-start gap-4">
		<Heading level={3}>Export</Heading>
		<p>
			You can export all of your Calibration Practice data to a JSON file. This is useful if you
			want to back up your data or transfer it to another device.
		</p>
		<Button size="lg" LeftIcon={ArrowUpTrayIcon} loading={exportLoading} onclick={exportData}>
			Export JSON
		</Button>
	</section>
	<section class="flex flex-col items-start gap-4">
		<Heading level={3}>Import</Heading>
		<p>You can import a JSON file that you exported from Calibration Practice.</p>
		{#if anyAnswers}
			<p class="text-sm text-main-500 dark:text-main-400">
				Data can only be imported if there is no existing data. Delete all data to be able to
				import.
			</p>
		{:else}
			<Button size="lg" LeftIcon={ArrowDownTrayIcon} loading={importLoading} onclick={importData}>
				Import JSON
			</Button>
		{/if}
	</section>
	<section class="flex flex-col items-start gap-4">
		<Heading level={3}>Deletion</Heading>
		<p>
			You can delete all your data from your browser. This is irreversible and will delete all your
			answers forever. You will not be able to recover them.
		</p>
		<Button
			LeftIcon={TrashIcon}
			size="lg"
			loading={deleteLoading}
			onclick={async () => {
				if (deleteDialog) {
					deleteDialog.open();
					return;
				}
			}}
		>
			Delete all data
		</Button>
	</section>
</div>

<SimpleDialog
	bind:this={deleteDialog}
	title="Delete all data"
	description="Are you sure you want to delete all your data? This action cannot be undone."
	buttons={[
		{ label: 'Delete', onclick: deleteData },
		{
			label: 'Cancel',
			variant: 'secondary',
			onclick: () => deleteDialog?.close()
		}
	]}
/>

<SimpleDialog
	bind:this={alertDialog}
	title={alertDialogTitle}
	description={alertDialogDescription}
	buttons={[
		{
			label: 'Alrighty',
			onclick: () => alertDialog?.close()
		}
	]}
/>
