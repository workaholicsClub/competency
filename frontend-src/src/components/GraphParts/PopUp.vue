<template>
	<g>
		<rect
                @mousemove="trackMouse($event, index)"
                @mouseover="$emit('hover', index)"
                @mouseout="$emit('hover', null)"
                fill="transparent"
                v-for="(r,index) in hoverRects"
                :x="r.x"
                :y="r.y"
                :width="r.w"
                :height="r.h"
                :key="index"
        />
	</g>
</template>

<script>
export default {
	props: ['id', 'dataset', 'labels', 'innerWidth', 'padding', 'yAxisSpace', 'xAxisSpace', 'innerHeight', 'fontSize', 'type', 'hovered', 'popUpPadding'],
	computed: {
		line () {
			const X = this.padding + this.yAxisSpace + this.innerWidth / this.labels.length * (this.hovered + 0.5)
			const Y = this.padding + this.innerHeight / this.labels.length * (this.hovered + 0.5)
			return {
				x1: this.type === 'bar' ? this.padding + this.yAxisSpace : X,
				y1: this.type === 'bar' ? Y : this.padding,
				x2: this.type === 'bar' ? this.padding + this.yAxisSpace + this.innerWidth : X,
				y2: this.type === 'bar' ? Y : this.padding + this.innerHeight
			}
		},
		hoverRects () {
			return this.labels.map((x, index) => {
				return {
					x: (this.type === 'bar' ? 0 : this.innerWidth / this.labels.length * index) + this.padding + this.yAxisSpace,
					y: this.padding + (this.type === 'bar' ? this.innerHeight / this.labels.length * index : 0),
					w: this.type === 'bar' ? this.innerWidth : this.innerWidth / this.labels.length,
					h: this.type === 'bar' ? this.innerHeight / this.labels.length : this.innerHeight
				}
			})
		},
		popUp () {
			let lengths = this.dataset.map(x => {
				return (x.label.length + x.data[this.hovered].toString().length + 1) * 10 + this.fontSize
			})
			const labelText = typeof this.labels[this.hovered] === 'string' ? this.labels[this.hovered] : this.labels[this.hovered].popUp
			lengths.push(labelText.length * 10)
			const w = lengths.reduce((a, b) => { return Math.max(a, b) }) + this.popUpPadding * 2
			const h = this.popUpPadding * 2 + this.dataset.length * this.fontSize * 1.5 + this.fontSize
			return {
				x: this.mousePos.x + this.fontSize + w > this.innerWidth + this.padding + this.yAxisSpace ? this.mousePos.x - this.fontSize - w : this.mousePos.x + this.fontSize,
				y: this.mousePos.y + this.fontSize + h > this.innerHeight + this.padding + this.xAxisSpace ? this.mousePos.y - this.fontSize - h : this.mousePos.y + this.fontSize,
				width: w,
				height: h
			}
		}
	},
	methods: {
		trackMouse (e, n) {
			this.mousePos = {
				x: e.clientX - e.target.getBoundingClientRect().left + this.padding + this.yAxisSpace + (this.type === 'bar' ? 0 : this.innerWidth / this.labels.length * n),
				y: e.clientY - e.target.getBoundingClientRect().top + this.padding + (this.type === 'bar' ? this.innerHeight / this.labels.length * n : 0)
			}
		}
	},
	data () {
		return {
			mousePos: null
		}
	}
}
</script>

<style scoped>
</style>
