<template>
    <div class="date-selector">
        <div class="date-selector__picker">
            Today

            <i class="icon-caret-down"></i>
        </div>
        <div class="date-selector__controls">
            <button>
                <i class="icon-chevron-left"></i>
            </button>
            <button>
                <i class="icon-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<style lang="css">
.date-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.date-selector__picker {
    background-color: var(--table-color);
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    width: 200px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.date-selector__controls {
    display: flex;
    background-color: var(--table-color);
    border-radius: var(--border-radius);
    height: 50px;

    button {
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        width: 50px;
        border-radius: var(--border-radius);
    }

    &::after {
        content: '';
        width: 1px;
        background-color: var(--background-color);
        translate: -50px;
    }
}
</style>