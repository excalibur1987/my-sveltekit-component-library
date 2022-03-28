<script >import { getNearestElement } from "@/utils";
import { sentenceCase } from "change-case";
export let maxShowCount = 2;
let selectionEl = null;
export let options;
$: options;
let { valueKey = "value", groupByKeys = null } = options;
let groupBy;
$: groupBy = options?.["groupBy"] || null;
const typeOfChoices = typeof options.choices[0] === "string" ? "string" : "object";
let choices;
$: {
    if (groupBy !== null) {
        choices = options.choices?.reduce((acc, choice) => {
            const key = choice?.[groupBy] || "N/A";
            return {
                ...acc,
                ...{
                    [key]: [...(acc?.[key] || []), choice],
                },
            };
        }, {});
    }
    else {
        choices = options.choices.map((choice) => {
            if (typeof choice === "string") {
                return {
                    value: choice,
                };
            }
            return choice;
        });
    }
}
export let selected = [];
$: selected;
let header = "Click to select";
$: {
    if (selected.length <= maxShowCount && selected.length > 0) {
        header = selected
            .map((selection) => {
            return typeOfChoices === "string" ? selection : selection[valueKey];
        })
            .join(", ");
    }
    else {
        header = "Multiple selection";
    }
}
let openList = false;
function handleChoiceChange(e, choice) {
    const input = e.target;
    const filteredSelection = selected.filter((selection) => {
        if (typeOfChoices === "string") {
            return selection !== choice[valueKey];
        }
        else {
            return selection[valueKey] !== choice[valueKey];
        }
    });
    selected = [
        ...filteredSelection,
        ...(!input.checked
            ? []
            : typeOfChoices === "string"
                ? [choice[valueKey]]
                : [choice]),
    ];
    if (groupBy !== null) {
        const groupHeader = getNearestElement(e.currentTarget, "ul").parentElement;
        const groupHeaderInput = groupHeader.querySelector("label>input");
        const unselectedCount = groupHeader
            .querySelector("ul")
            .querySelectorAll("input:not(:checked)").length;
        const selectedCount = groupHeader
            .querySelector("ul")
            .querySelectorAll("input:checked").length;
        groupHeaderInput.checked =
            groupHeader.querySelector("ul").querySelectorAll("input:not(:checked)")
                .length === 0;
        groupHeaderInput.indeterminate = unselectedCount > 0 && selectedCount > 0;
    }
}
function isSelected(choice) {
    return (selected?.findIndex((selection) => {
        if (typeOfChoices === "string") {
            return selection === choice[valueKey];
        }
        else {
            return selection[valueKey] === choice[valueKey];
        }
    }) >= 0);
}
const toggleOpen = () => {
    openList = !openList;
    document.addEventListener("click", clickOut);
};
const clickOut = (e) => {
    if (e.target !== selectionEl &&
        !selectionEl?.contains(e.target)) {
        openList = false;
        document.removeEventListener("click", clickOut);
    }
    return;
};
function handleSelectGroupBy(e, groupHeader) {
    const filteredSelection = selected.filter((selection) => {
        return selection?.[groupHeader] !== groupHeader;
    });
    selected = [
        ...filteredSelection,
        ...(e.currentTarget.checked ? choices[groupHeader] : []),
    ];
    const groupContainer = e.currentTarget.parentElement
        .parentElement;
    groupContainer
        .querySelectorAll('ul input[type="checkbox"]')
        .forEach((inpt) => {
        inpt.checked = e.currentTarget.checked;
    });
}
</script>

<section
  bind:this={selectionEl}
  class="selection-wrapper"
  on:keydown={(e) => {
    e.code === "Enter" && toggleOpen();
  }}
>
  <span class="header" tabindex="0" on:click={toggleOpen}>{header}</span>
  <section class="options-wrapper" class:open={openList}>
    <span class="group-keys-wrapper">
      {#each groupByKeys as groupKey}
        <span
          class="group-key"
          class:selected={groupKey === groupBy}
          on:click={() => (groupBy = groupKey)}>{sentenceCase(groupKey)}</span
        >
      {/each}
    </span>
    <ul>
      {#if Array.isArray(choices)}
        {#each choices as choice}
          <li>
            <label
              ><input
                on:change={(e) => handleChoiceChange(e, choice)}
                checked={isSelected(choice)}
                type="checkbox"
              />{choice[valueKey]}</label
            >
          </li>
        {/each}
      {:else}
        {#each Object.keys(choices) as groupHeader}
          <li class="group-header">
            <label
              ><input
                checked={false}
                type="checkbox"
                on:change={(e) => handleSelectGroupBy(e, groupHeader)}
              />{groupHeader}</label
            >
            <ul>
              {#each choices[groupHeader] as choice}
                <li>
                  <label
                    ><input
                      on:change={(e) => handleChoiceChange(e, choice)}
                      checked={isSelected(choice)}
                      type="checkbox"
                    />{choice[valueKey]}</label
                  >
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      {/if}
    </ul>
  </section>
</section>

<style >@keyframes animateShow {
  0% {
    opacity: 0; }
  100% {
    opacity: 1; } }

section.selection-wrapper {
  width: 20vw;
  position: relative;
  display: flex;
  flex-direction: column; }
  section.selection-wrapper span.header {
    padding: 3px;
    cursor: pointer;
    border: solid 1px;
    border-radius: 4px;
    min-width: 100%;
    user-select: none; }
  section.selection-wrapper section.options-wrapper {
    border: solid 1px;
    border-radius: 4px;
    min-width: 100%;
    display: none;
    position: absolute;
    top: calc(5px + 1.5em);
    background-color: #fff; }
    section.selection-wrapper section.options-wrapper span.group-keys-wrapper {
      display: flex;
      flex-direction: row;
      gap: 10px;
      justify-content: center;
      padding-top: 5px; }
      section.selection-wrapper section.options-wrapper span.group-keys-wrapper span.group-key {
        background-color: #4eaee6;
        border-radius: 5px;
        border: solid 1px;
        padding: 2px;
        cursor: pointer; }
        section.selection-wrapper section.options-wrapper span.group-keys-wrapper span.group-key.selected {
          background-color: #a8a4a4;
          border-style: groove; }
    section.selection-wrapper section.options-wrapper.open {
      display: block;
      animation: animateShow 0.7s; }
    section.selection-wrapper section.options-wrapper label {
      cursor: pointer; }
    section.selection-wrapper section.options-wrapper ul {
      list-style: none;
      padding-left: 0.8rem;
      padding-bottom: 3px;
      margin: 0; }
</style>
