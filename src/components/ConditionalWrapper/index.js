const ConditionalWrapper = ({ condition, wrapper, wrapper2, children }) => condition ? wrapper(children) : wrapper2(children);
export default ConditionalWrapper;