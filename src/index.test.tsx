import ReactTestRender from "react-test-renderer";
import { useCallback, useEffect } from "react";
import { useSuspenseRender } from "./hooks";
import { SuspenseRenderProvider } from "./providers";

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

describe("`useSuspenseRender` Testing", () => {
  it("renderSuccess", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
    });
  });
  it("renderError", async () => {
    const TestComponent = () => {
      const asyncErrorTask = useCallback(
        async () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Err")), 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string, Error>();
      useEffect(() => {
        runTask(async () => {
          await asyncErrorTask();
          return "Aaa";
        });
      }, [asyncErrorTask, runTask]);
      return suspenseRender(
        (data) => <p>Success({data})</p>,
        <p>Loading</p>,
        (e) => <p>Error({e.message})</p>,
      );
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Error(Err)");
    });
  });
  it("renderSuccess(with provider)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>);
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        renderSuccess={<p>Success(Provider)</p>}
        renderLoading={<p>Loading(Provider)</p>}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    // The provider is used because the component does not have its own render function.
    expect(state1.children?.join("")).toEqual("Loading(Provider)");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      // The provider is not used because the component has its own render function.
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
    });
  });
  it("renderError(with provider)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Err")), 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>);
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        renderError={<p>Error(Provider)</p>}
        renderLoading={<p>Loading(Provider)</p>}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    // The provider is used because the component does not have its own render function.
    expect(state1.children?.join("")).toEqual("Loading(Provider)");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      // The provider is not used because the component has its own render function.
      expect(state2.children?.join("")).toEqual("Error(Provider)");
    });
  });
  it("renderSuccess(with defaultData)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>({
        defaultData: "DefaultData",
      });
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Success(DefaultData)");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
    });
  });
  it("renderSuccess(with taskRunnerInterceptor", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        experimentals={{
          taskRunnerInterceptor: () => {
            return "Bbb";
          },
        }}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Bbb)");
    });
  });
  it("Asynchronous `taskRunner` error", async () => {
    const TestComponent = () => {
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          throw new Error("Error");
        });
      }, [runTask]);
      return suspenseRender(<p>Success</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Error");
    });
  });
  it("Synchronous `taskRunner` error", async () => {
    const TestComponent = () => {
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        try {
          runTask(() => {
            throw new Error("Error");
          });
        } catch (e) {
          // console.log(e);
        }
      }, [runTask]);
      return suspenseRender(<p>Success</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Error");
    });
  });
});
